"""
StarFrom AgentOS Python SDK - Client
"""

import requests
from typing import Optional, Dict, Any, List
from .exceptions import (
    AgentOSError,
    AuthenticationError,
    RateLimitError,
    NotFoundError,
)


class AgentOSClient:
    """Client for interacting with the StarFrom AgentOS API."""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.starfrom.ai",
        timeout: int = 30,
    ):
        """
        Initialize the AgentOS client.

        Args:
            api_key: Your API key from the dashboard
            base_url: Base URL for the API (defaults to production)
            timeout: Request timeout in seconds
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })

    def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make an API request."""
        url = f"{self.base_url}{endpoint}"

        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=json,
                timeout=self.timeout,
            )

            if response.status_code == 401:
                raise AuthenticationError("Invalid API key")
            elif response.status_code == 429:
                raise RateLimitError("Rate limit exceeded")
            elif response.status_code == 404:
                raise NotFoundError("Resource not found")
            elif response.status_code >= 400:
                raise AgentOSError(
                    f"API error: {response.status_code} - {response.text}"
                )

            return response.json()
        except requests.exceptions.RequestException as e:
            raise AgentOSError(f"Request failed: {str(e)}")

    def chat(
        self,
        agent_id: str,
        message: str,
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send a message to an agent and get a response.

        Args:
            agent_id: The agent's ID
            message: The message to send
            session_id: Optional session ID for conversation continuity

        Returns:
            Response containing the agent's reply
        """
        payload = {
            "message": message,
        }
        if session_id:
            payload["session_id"] = session_id

        return self._request(
            "POST",
            f"/api/v1/agents/{agent_id}/chat",
            json=payload,
        )

    def list_agents(self) -> List[Dict[str, Any]]:
        """
        List all agents in your workspace.

        Returns:
            List of agent objects
        """
        response = self._request("GET", "/api/v1/agents")
        return response.get("data", [])

    def get_agent(self, agent_id: str) -> Dict[str, Any]:
        """
        Get details of a specific agent.

        Args:
            agent_id: The agent's ID

        Returns:
            Agent object
        """
        return self._request("GET", f"/api/v1/agents/{agent_id}")

    def create_agent(
        self,
        name: str,
        system_prompt: str,
        model: str = "gpt-4o-mini",
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Create a new agent.

        Args:
            name: Agent name
            system_prompt: System prompt/instructions for the agent
            model: Model to use (default: gpt-4o-mini)
            **kwargs: Additional agent configuration

        Returns:
            Created agent object
        """
        payload = {
            "name": name,
            "system_prompt": system_prompt,
            "model": model,
            **kwargs,
        }
        return self._request("POST", "/api/v1/agents", json=payload)

    def list_sessions(self, agent_id: str) -> List[Dict[str, Any]]:
        """
        List all sessions for an agent.

        Args:
            agent_id: The agent's ID

        Returns:
            List of session objects
        """
        response = self._request(
            "GET",
            f"/api/v1/agents/{agent_id}/sessions",
        )
        return response.get("data", [])

    def get_session_history(
        self,
        session_id: str,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Get message history for a session.

        Args:
            session_id: The session's ID
            limit: Maximum number of messages to return

        Returns:
            List of message objects
        """
        response = self._request(
            "GET",
            f"/api/v1/sessions/{session_id}/messages",
            params={"limit": limit},
        )
        return response.get("data", [])

    def search_knowledge(
        self,
        agent_id: str,
        query: str,
        top_k: int = 5,
    ) -> Dict[str, Any]:
        """
        Search the knowledge base associated with an agent.

        Args:
            agent_id: The agent's ID
            query: Search query
            top_k: Number of results to return

        Returns:
            Search results
        """
        return self._request(
            "POST",
            f"/api/v1/agents/{agent_id}/knowledge/search",
            json={
                "query": query,
                "top_k": top_k,
            },
        )

    def get_usage(self, period: str = "30d") -> Dict[str, Any]:
        """
        Get API usage statistics.

        Args:
            period: Time period (7d, 30d, or 90d)

        Returns:
            Usage statistics
        """
        return self._request(
            "GET",
            "/api/usage",
            params={"period": period},
        )

    def close(self):
        """Close the HTTP session."""
        self.session.close()
