export default class Cart {
  constructor (discount = 0) {
    this.items = []
    this.discount = discount
  }
  get count () {
    return this.items.length
  }
  *[Symbol.iterator] () {
    for (let item of this.items) {
      yield item
    }
  }
  static loadCart () {
    let cart = sessionStorage.getItem('cart') || '[]'
    cart = JSON.parse(cart)
    return cart
  }
  static saveCart (cart) {
    sessionStorage.setItem('cart', JSON.stringify([...cart]))
  }
  valueOf () {
    return this.items.length && this.items
      .map(book => (book.discount_tax ? book.book_price * (1 - book.discount_tax / 100) : book.book_price) * book.num)
      .reduce((a, i) => +a + +i) * (1 - this.discount / 100)
  }
  toString () {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this)
  }
}
