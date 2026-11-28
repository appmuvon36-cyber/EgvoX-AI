'use client';
import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {egvoxApi} from '@/lib/egvox-api';
export default function AcceptInvitationPage(){
 const router=useRouter();const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
 const getToken=()=>new URLSearchParams(window.location.hash.slice(1)).get('token')||'';
 const signIn=()=>{const token=getToken();router.push('/login?next='+encodeURIComponent('/accept-invitation#token='+token));};
 const respond=async(action:'accept'|'reject')=>{const token=getToken();if(!token){setError('Invitation token is missing.');return;}setBusy(true);setError('');try{await egvoxApi('/organizations/invitations/'+action,{method:'POST',body:JSON.stringify({token})});window.history.replaceState(null,'',window.location.pathname);setStatus(action==='accept'?'Invitation accepted.':'Invitation declined.');if(action==='accept')router.replace('/account/organizations');}catch(e){setError(e instanceof Error?e.message:'Invitation could not be processed');}finally{setBusy(false);}};
 return <main className="mx-auto max-w-md space-y-4 px-4 py-16"><h1 className="text-2xl font-bold">Organization invitation</h1><p className="text-sm text-[var(--egvox-text-secondary)]">Sign in with the email address that received this invitation. The invitation is single-use and expires.</p>{error&&<p role="alert" className="text-sm text-red-600">{error}</p>}{status&&<p role="status" className="text-sm text-emerald-700">{status}</p>}<button onClick={signIn} className="inline-flex h-10 items-center text-sm font-semibold text-[#027F86]">Sign in to continue</button><div className="flex gap-2"><button disabled={busy} onClick={()=>respond('accept')} className="h-11 flex-1 rounded-lg bg-[#027F86] text-sm font-semibold text-white">Accept</button><button disabled={!token||busy} onClick={()=>respond('reject')} className="h-11 flex-1 rounded-lg border text-sm">Decline</button></div></main>;
}
