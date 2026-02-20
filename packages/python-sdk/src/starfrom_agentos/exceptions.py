"""
StarFrom AgentOS Python SDK - Exceptions
"""


class AgentOSError(Exception):
    """Base exception for all AgentOS errors."""
    pass


class AuthenticationError(AgentOSError):
    """Raised when authentication fails."""
    pass


class RateLimitError(AgentOSError):
    """Raised when rate limit is exceeded."""
    pass


class NotFoundError(AgentOSError):
    """Raised when a resource is not found."""
    pass
