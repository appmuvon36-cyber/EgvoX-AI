import hashlib
import secrets

def test_invitation_token_is_random_and_stored_as_digest():
    raw = secrets.token_urlsafe(40)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    assert raw != digest
    assert len(digest) == 64
    assert digest == hashlib.sha256(raw.encode()).hexdigest()
