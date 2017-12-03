export default class Cart {
  static addToCart (items, item) {
    let itemAddToCart = item
    const cart = {}
    const map = new Map(Object.entries(items))

    itemAddToCart.num = 1

    if (map.has(item.book_id)) {
      itemAddToCart = map.get(item.book_id)
      itemAddToCart.num++
    }

    map.set(item.book_id, itemAddToCart)

    map.forEach(function (value, key) {
      cart[key] = value
    })

    return cart
  }
  static updateBookNum (items, id, num) {
    let itemUpdate
    const cart = {}
    const map = new Map(Object.entries(items))

    if (map.has(id) && Number.isInteger(num)) {
      itemUpdate = map.get(id)
      itemUpdate.num = num
    }

    map.set(id, itemUpdate)

    map.forEach(function (value, key) {
      cart[key] = value
    })

    return cart
  }
  static processToArray (items) {
    const cartArray = []
    const map = new Map(Object.entries(items))

    map.forEach(function (value, key) {
      cartArray.push(value)
    })

    return cartArray
  }
  static removeFromCart (items, id) {
    const cart = {}
    const map = new Map(Object.entries(items))

    map.delete(id)

    map.forEach(function (value, key) {
      cart[key] = value
    })

    return cart
  }
  static loadCart (sessionManager) {
    let cart = sessionManager.get('cart') || '{}'
    cart = JSON.parse(cart)
    return cart
  }
  static saveCart (cart, sessionProvider) {
    sessionProvider.set('cart', JSON.stringify(cart))
  }
  static totalCart (items) {
    const map = new Map(Object.entries(items))

    return map.size
  }
}
