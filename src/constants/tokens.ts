import ms from "ms"

enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export const TOKENS_DURATION_MS: Record<TokenType, ms.StringValue> = {
  [TokenType.ACCESS]: "2h",
  [TokenType.REFRESH]: "7d",
}

export const REFRESH_TOKEN_DAYS_DURATION = 7
