import boxen from 'boxen'
import picocolors from 'picocolors'
import type { Plugin } from 'vite'

export default function appInfo(): Plugin {
  return {
    name: 'appInfo',
    apply: 'serve',
    async buildStart() {
      const { bold, green, cyan, bgGreen, underline } = picocolors
      // eslint-disable-next-line no-console
      console.log(
        boxen(
          `${bold(green(`${bgGreen('Sakura Automation Platform v1.0.0')}`))}\n${cyan('在线文档：')}${underline('https://sakura.hk.cn/')}\n${cyan('持续迭代优化的一站式持续自动化平台。')}`,
          {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            textAlignment: 'center'
          }
        )
      )
    }
  }
}
