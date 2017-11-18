export default class Cart {
  constructor () {
    this.items = []
    this[Symbol.iterator] = function* () {
      for (let item of this.items) {
        yield item
      }
    }
  }
  get count () {
    return this.items.length
  }
  static loadCart () {
    let cart = sessionStorage.getItem('cart') || '[]'
    cart = JSON.parse(cart)
    return cart
  }
  static saveCart (cart) {
    sessionStorage.setItem('cart', JSON.stringify([...cart]))
  }
}
