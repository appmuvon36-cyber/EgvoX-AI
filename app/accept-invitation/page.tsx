'use client';
import React,{useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {egvoxApi} from '@/lib/egvox-api';
export default function AcceptInvitationPage(){
 const router=useRouter();const [token,setToken]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
 useEffect(()=>{Promise.resolve().then(()=>setToken(new URLSearchParams(window.location.search).get('token')||''));},[]);
 const respond=async(action:'accept'|'reject')=>{setBusy(true);setError('');try{await egvoxApi('/organizations/invitations/'+action,{method:'POST',body:JSON.stringify({token})});setStatus(action==='accept'?'Invitation accepted.':'Invitation declined.');if(action==='accept')router.replace('/account/organizations');}catch(e){setError(e instanceof Error?e.message:'Invitation could not be processed');}finally{setBusy(false);}};
 return <main className="mx-auto max-w-md space-y-4 px-4 py-16"><h1 className="text-2xl font-bold">Organization invitation</h1><p className="text-sm text-[var(--egvox-text-secondary)]">Sign in with the email address that received this invitation. The invitation is single-use and expires.</p>{!token&&<p role="alert" className="text-sm text-red-600">Invitation token is missing.</p>}{error&&<p role="alert" className="text-sm text-red-600">{error}</p>}{status&&<p role="status" className="text-sm text-emerald-700">{status}</p>}<div className="flex gap-2"><button disabled={!token||busy} onClick={()=>respond('accept')} className="h-11 flex-1 rounded-lg bg-[#027F86] text-sm font-semibold text-white">Accept</button><button disabled={!token||busy} onClick={()=>respond('reject')} className="h-11 flex-1 rounded-lg border text-sm">Decline</button></div></main>;
}
