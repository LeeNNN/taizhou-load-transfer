import React, { useState, useEffect } from "react"

export default props => {
  const { src = "", fit = "cover", style = { width: "100%", height: "100%" } } = props
  const [imgSrc, setSrc] = useState(src)
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.addEventListener("load", () => {
      setSrc(src)
    }, false)
  }, [src])

  return (
    <img src={imgSrc} alt="404" className="not-found" style={{ ...style, objectFit: fit }} />
  )
}