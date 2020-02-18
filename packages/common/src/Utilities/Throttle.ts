import os from 'os'

import { all, Task } from 'promise-parallel-throttle'

const CPU_COUNT = os.cpus().length

export function Throttle<T>(tasks: Task<T>[], maxInProgress?: number): Promise<T[]> {
  return all<T>(tasks, { maxInProgress: maxInProgress || CPU_COUNT })
}
