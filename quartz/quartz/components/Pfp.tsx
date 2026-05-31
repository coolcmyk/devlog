import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Pfp: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "pfp-slot")}> 
      <a href="https://github.com/coolcmyk" aria-label="coolcmyk on GitHub">
        <img
          src="https://github.com/coolcmyk.png?size=128"
          alt="coolcmyk"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  )
}

Pfp.css = `
.pfp-slot {
  width: 6.5rem;
  height: 6.5rem;
  margin: 0 0 0.65rem 0;
}

.pfp-slot a {
  display: inline-flex;
  width: 100%;
  height: 100%;
}

.pfp-slot img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  display: block;
  object-fit: cover;
}
`

export default (() => Pfp) satisfies QuartzComponentConstructor
