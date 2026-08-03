import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="border-ink/40 dark:border-ink-dark/40 flex h-full flex-col rounded-none border">
    {imgSrc &&
      (href ? (
        <Link href={href} aria-label={`Link to ${title}`}>
          <Image
            alt={title}
            src={imgSrc}
            className="border-ink/40 dark:border-ink-dark/40 h-48 w-full border-b object-cover object-center"
            width={544}
            height={306}
          />
        </Link>
      ) : (
        <Image
          alt={title}
          src={imgSrc}
          className="border-ink/40 dark:border-ink-dark/40 h-48 w-full border-b object-cover object-center"
          width={544}
          height={306}
        />
      ))}
    <div className="flex flex-1 flex-col p-6">
      <h2 className="font-display text-2xl leading-tight font-bold">
        {href ? (
          <Link href={href} aria-label={`Link to ${title}`} className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <p className="text-ink/70 dark:text-ink-dark/70 mt-3 font-serif text-[15px] leading-relaxed">
        {description}
      </p>
      {href && (
        <Link
          href={href}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-auto pt-4 font-mono text-[11px] tracking-widest uppercase underline underline-offset-4"
          aria-label={`Link to ${title}`}
        >
          Learn more &rarr;
        </Link>
      )}
    </div>
  </div>
)

export default Card
