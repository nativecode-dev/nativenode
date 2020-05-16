export function ProcessTimeout<T>(seconds: number, returns?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(returns || void 0), seconds * 1000))
}
