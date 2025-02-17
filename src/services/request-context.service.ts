import { User } from "@prisma/client"
import { AsyncLocalStorage } from "node:async_hooks"

interface RequestContext {
  user?: User
}

class RequestContextService {
  private storage: AsyncLocalStorage<RequestContext>

  constructor() {
    this.storage = new AsyncLocalStorage<RequestContext>()
  }

  getRequestContext(): RequestContext {
    return this.storage.getStore() || {}
  }

  runWithRequestContext<T>(callback: () => T, context: RequestContext): T {
    return this.storage.run(context, callback)
  }
}

export const requestContextService = new RequestContextService()
