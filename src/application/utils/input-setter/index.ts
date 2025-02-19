export type InputSetOptions = {
  /** Selector to find the input element */
  selector: string
  /**
   * We support the following input types:
   * - text
   * - checkbox
   * - radio
   * - number
   * - date
   */
  value: unknown
}

class InputSetter {
  constructor() {}

  async setAll(options: Array<InputSetOptions>) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]

      await this.set(option)
    }
  }

  set(options: InputSetOptions): Promise<void> {
    return new Promise<void>((resolve) => {
      const input = document.querySelector(options.selector) as HTMLInputElement

      if (input.type === 'text') {
        input.value = options.value as string
      } else if (input.type === 'checkbox') {
        input.checked = options.value as boolean
      } else if (input.type === 'radio') {
        input.checked = options.value as boolean
      } else if (input.type === 'number') {
        input.valueAsNumber = options.value as number
      } else if (input.type === 'date') {
        input.valueAsDate = options.value as Date
      } else {
        input.value = options.value as string
      }

      const event = new Event('input', {
        bubbles: true,
        cancelable: true
      })

      input.dispatchEvent(event)

      resolve()
    })
  }
}

export default InputSetter
