'use strict'

module.exports = function (options) {
  options = options || {}
  const elementPrefix = options.elementPrefix || '__'
  const modPrefix = options.modPrefix || '_'

  return function PosthtmlCustomComponents (tree) {
    tree.match({ tag: 'component' }, function (node, block, element, modifier) {
      if (!node.attrs) {
        return node
      }

      if (node.attrs) {
        let classList = []

        if (!node.attrs.name || !node.attrs.name && node.attrs.mod) {
          return node
        }

        if (node.attrs.name) {
          block = node.attrs.name
          classList.push(block)
        }

        if (node.attrs.mod) {
          modifier = node.attrs.name + modPrefix + node.attrs.mod
          classList.push(modifier)
        }

        Object.assign(node, { tag: 'div', attrs: { class: classList.join(' ') } })

        checkContent(node)

        return node
      }

      function checkContent (node) {
        if (node.content) {
          buildElement(node.content)
        }
        return node
      }

      function buildElement (node) {
        node.forEach(function (node) {
          if (node.tag) {
            let classList = []

            if (!node.attrs || !node.attrs.mod) {
              element = block + elementPrefix + node.tag
              classList.push(element)
            }

            if (node.attrs) {
              if (node.attrs.mod) {
                element = block + elementPrefix + node.tag
                classList.push(element)

                modifier = element + modPrefix + node.attrs.mod
                classList.push(modifier)
              }
            }

            Object.assign(node, { tag: 'div', attrs: { class: classList.join(' ') } })

            checkContent(node)

            return node
          }
        })
      }
    })
    return tree
  }
}
