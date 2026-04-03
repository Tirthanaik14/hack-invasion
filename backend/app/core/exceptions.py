from fastapi import HTTPException, status


class IncidentNotFoundError(HTTPException):
    def __init__(self, incident_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident with id {incident_id} not found",
        )


class UnauthorizedError(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class InvalidCredentialsError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


class ValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )
