import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#00ABB3", "#1D1CE5"],
    mastercard: ["#DC5F00", "#CF0A0A"],
    hipercard: ["#EA047E", "#FF577F"],
    maestro: ["#5CB8E4", "#400D51"],
    elo: ["#31E1F7", "#FFDE00"],
    alelo: ["#A5F1E9", "#42855B"],
    americanExpress: ["#CF0A0A", "#1D1CE5"],
    default: ["black", "gray"]
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// Security code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}

const SecurityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d{0,1}|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
      cardType: "hipercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/,
      cardType: "maestro"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
      cardType: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47]\d{13}$/,
      cardType: "americanExpress"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "**********" : cardHolder.value
})

SecurityCodeMasked.on("accept", () => {
  updateSecurityCode(SecurityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCardNUmber(cardNumberMasked.value)
})

function updateCardNUmber(number) {
  const cardNumberElement = document.querySelector(".cc-number")
  console.log(number)
  cardNumberElement.innerText =
    number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(data) {
  const expirationDateElement = document.querySelector(
    ".cc-extra .cc-expiration .value"
  )

  expirationDateElement.innerText = data.length === 0 ? "02/32" : data
}
