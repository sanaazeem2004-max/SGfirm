// Practice areas exactly as published on stegmeierandgelbart.com/practice-areas/.
// `body` and `items` are the source copy; `summary` is a condensed line drawn
// from that copy for cards.
import {
  Scale,
  Users,
  Plane,
  Wallet,
  Baby,
  RefreshCw,
  ShieldAlert,
  FileSignature,
  SlidersHorizontal,
  Landmark,
  MessagesSquare,
  HeartHandshake,
} from 'lucide-react'

export const practices = [
  {
    slug: 'dissolution',
    title: 'Dissolution of Marriage (Divorce)',
    short: 'Divorce',
    icon: Scale,
    image: '/images/site/Sgsb-About-1-1024x512.jpg',
    summary:
      'Aggressive strategy with compassion and understanding — and frequent communication so you always know where your case stands.',
    body: [
      'The process of dissolving a marital relationship (dissolution or divorce) is emotionally challenging and stressful. SGSB’s attorneys are aggressive strategists when it comes to achieving our client’s goals, but we also maintain compassion and understanding toward our clients.',
      'Given the vast number of issues that family law clients face, we maintain frequent communication with our clients – via email or telephone – to ensure that they are informed about the status of their cases.',
    ],
    itemsTitle: 'Within any divorce matter, there are numerous issues to resolve, including:',
    items: [
      'Characterization, Valuation, and Division of Assets & Liabilities',
      'Attorneys Fees and Costs',
      'Business Valuation',
      'Determination and Tracing of Separate Property Rights',
      'Breach of Fiduciary Duty',
      'Child Custody/Parenting Time Disputes',
      'Child Support',
      'Spousal Support',
    ],
  },
  {
    slug: 'child-custody-time',
    title: 'Child Custody & Parenting Time Disputes',
    short: 'Child Custody',
    icon: Users,
    image: '/images/site/Paternity.jpg',
    summary:
      'An expedient, child-focused resolution — and, when agreement isn’t possible, a fierce defense of your parental rights.',
    body: [
      'There is rarely any issue over which parties will fight harder than the custody of their children. SGSB attorneys work closely with our clients to develop an expedient resolution of custody to avoid a prolonged battle that will incur a substantial emotional toll on both parties and the children. Our approach involves utilizing counseling and input from mental health professionals, negotiations between attorneys, and formal or informal mediation to assist the parties in reaching a reasonable, child-focused resolution.',
      'There are times when an agreement between two parents cannot be attained through negotiation. In these instances, our attorneys approach litigation with a solid understanding of child custody laws and fiercely defend clients’ parental rights.',
    ],
  },
  {
    slug: 'child-custody-requests',
    title: 'Child Custody Move-Away Requests',
    short: 'Move-Away Requests',
    icon: Plane,
    image: '/images/site/child-move.jpg',
    summary:
      'Complex custody matters involving a parent who wishes to move out of state or out of the country with the children.',
    body: [
      'Many of our complex child custody trials involve parents wishing to move out of state or out of the country with their kids. While a custodial parent in California has the presumptive right to move as he or she wishes with his or her children, there are nuances to the laws that may be applied.',
    ],
  },
  {
    slug: 'child-support',
    title: 'Child Support',
    short: 'Child Support',
    icon: Wallet,
    image: '/images/site/Paternity.jpg',
    summary:
      'A fair and reasonable support amount, quickly assessed from the finances and assets involved in your case.',
    body: [
      'One of the most important components of any family law case involving children, aside from custody, is child support. Support is the court-ordered financial maintenance of a child. As soon as the divorce petition is filed, issues concerning temporary child support often arise. SGSB’s lawyers quickly assess a fair and reasonable support amount based on the finances and assets involved in a client’s case.',
    ],
  },
  {
    slug: 'parentage',
    title: 'Parentage (Paternity)',
    short: 'Parentage',
    icon: Baby,
    image: '/images/site/Paternity.jpg',
    summary:
      'Custody, parenting time and support issues that arise outside of a marriage, with their own special rules and procedures.',
    body: [
      'Sometimes child custody, parenting time, and child support issues arise outside of a marital relationship. These proceedings are called “Parentage” or Paternity actions. While many of the considerations overlap with custody or child support disputes arising in a divorce, there are special rules and procedures that must be followed. The attorneys at SGSB possess the expertise to handle these sensitive matters.',
    ],
  },
  {
    slug: 'court-orders',
    title: 'Modification & Enforcement of Existing Court Orders',
    short: 'Modification & Enforcement',
    icon: RefreshCw,
    image: '/images/site/Counter-Background-1024x462.jpg',
    summary:
      'Changing an order, defending against a change, or forcing compliance — a large portion of SGSB’s practice.',
    body: [
      'Do you have an existing court order that you want to change? Is someone trying to change an existing court order against your desires? Are you having difficulty forcing another party to comply with existing court orders? These are very common circumstances and these proceedings constitute a large portion of SGSB’s practice.',
      'Frequently, modification requests are won or lost at the outset depending on certain procedural thresholds. SGSB’s attorneys strategize with our clients to establish the best position when facing a modification action – either on the requesting or defending side of the issue.',
    ],
  },
  {
    slug: 'domestic-violence',
    title: 'Domestic Violence / Restraining Orders',
    short: 'Domestic Violence',
    icon: ShieldAlert,
    image: '/images/site/police.jpg',
    summary:
      'Extensive experience representing both the accuser and the accused — working quickly, because timing is essential.',
    body: [
      'Issues of domestic violence are taken very seriously by Orange County courts and can have a serious and lasting impact on child custody and visitation, spousal support and other issues. SGSB has extensive experience successfully representing both the accuser and the accused in these sensitive family matters. Timing is essential in these matters, and SGSB’s attorneys work quickly and efficiently to prepare our case for success at trial.',
    ],
    article: 'obtaining-domestic-violence-restraining-orders',
  },
  {
    slug: 'premarital-agreements',
    title: 'Validity of Premarital (Prenuptial) Agreements',
    short: 'Premarital Agreements',
    icon: FileSignature,
    image: '/images/site/About-join.jpg',
    summary:
      'Skilled at both challenging and upholding the provisions of premarital agreements drafted by other attorneys.',
    body: [
      'There are many procedural requirements that must be followed for a Premarital Agreement to be valid and enforced. Further, certain provisions in some Premarital Agreements are considered unenforceable because of their impact on one of the parties to the Agreement. SGSB’s attorneys are skilled at both challenging and upholding the provisions of Premarital Agreements drafted by other attorneys and signed by our clients.',
    ],
  },
  {
    slug: 'limited-scope-representation',
    title: 'Limited Scope Representation',
    short: 'Limited Scope',
    icon: SlidersHorizontal,
    image: '/images/site/About-join.jpg',
    summary:
      'Skilled representation for a defined task, with flexibility in the retainer amount and payment arrangements.',
    body: [
      'Are you in need of skilled legal representation and have limited financial resources? If so, SGSB can assist you with our limited scope representation option.',
      'Narrowing the scope of our representation enables our attorneys to be flexible in the retainer amount and payment arrangements, when appropriate.',
      'Please schedule a consultation with us to learn more about these limited scope/reduced retainer options.',
    ],
    itemsTitle: 'SGSB’s attorneys are frequently retained for limited purposes such as:',
    items: [
      'Litigating a limited issue court hearing',
      'Serving solely as Trial Counsel to conduct the trial (after discovery has been completed by other attorneys)',
      'Advising clients who are participating in mediation',
      'Negotiating settlements',
      'Conducting or defending depositions',
      'Guidance/Consulting',
    ],
  },
  {
    slug: 'spousal-support',
    title: 'Spousal Support',
    short: 'Spousal Support',
    icon: Landmark,
    image: '/images/site/Counter-Background-1024x462.jpg',
    summary:
      'Decades of experience litigating and settling one of the most contentious — and long-lasting — issues in a divorce.',
    body: [
      'Spousal Support (sometimes referred to as “Alimony” or “Maintenance”) is sometimes one of the most contentious issues in a divorce. There are over 15 factors which courts must analyze to determine if, and to what extent (amount and duration), spousal support will be ordered.',
      'Given the long lasting effects the outcome of a spousal support issue may have on the parties, it is particularly imperative that litigants have the most experienced and knowledgeable attorneys to handle these important issues. SGSB’s attorneys have decades of experience successfully litigating and settling spousal support issues.',
    ],
  },
  {
    slug: 'mediation',
    title: 'Mediation',
    short: 'Mediation',
    icon: MessagesSquare,
    image: '/images/site/Sgsb-About-1-1024x512.jpg',
    summary:
      'Reach agreements together through our in-house Mediation Center — without contentious, stressful, expensive court proceedings.',
    body: [
      'Mediation is an alternative to litigation. In Mediation the parties work together to reach agreements without the necessity of engaging in contentious, stressful, expensive court proceedings.',
      'In 2016 SGSB developed a Mediation Center designed to provide the highest quality mediation services in Southern California, with two of our mediation attorneys, Eleanor Stegmeier and Michael Fisher, being Fellows of the American Academy of Matrimonial Lawyers.',
      'Call our office or use the contact form to schedule a consultation with one of our experienced mediators.',
    ],
    attorneys: ['eleanor-a-stegmeier', 'michael-a-fisher'],
    attorneysTitle: 'Mediation attorneys',
  },
  {
    slug: 'same-sex-relationships',
    title: 'Same Sex Relationships / Dissolution',
    short: 'Same Sex Relationships',
    icon: HeartHandshake,
    image: '/images/site/New-Slide-background.jpg',
    summary:
      'Skill, creativity and knowledge for the unique issues in same-sex dissolutions and domestic partnerships.',
    body: [
      'SGSB’s attorneys have extensive experience in handling the unique issues which arise during the dissolution of same-sex couples and registered (and non-registered) domestic partnerships. We know that there are a variety of issues which can arise in same-sex cases and they require skill, creativity, and knowledge to successfully navigate this relatively new sub-area of family law.',
    ],
  },
]

export const getPractice = (slug) => practices.find((p) => p.slug === slug)
