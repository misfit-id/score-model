import { 
  SOCIAL_MEDIA_SCORE,
  KYC_ID_BOOST,

  GREEN_CHECKMARK_THRESHOLD,
  
  DECAY_FACTOR,
  MAX_WALKDOWN_DEPTH,
  WALKDOWN_DECAY,
  WALKUP_DECAY,
} from './consts'

export class Profile {
  isRoot: boolean

  socialNetworks: string[]
  quadraticVouch: number[]
  kycIDBoost: string

  inviter: Profile | undefined
  invitee: Profile[]
  

  // caching fields
  currentScore: number

  constructor(config: {
      isRoot: boolean,

      farcaster?: boolean,
      shortENS?: boolean,
      lens?: boolean,
      ENS?: boolean,

      github?: boolean,
      twitter?: boolean,
      gmail?: boolean,


      vouches?: number[],
      kycIDBoost?: string,

      inviter?: Profile,
      invitee: Profile[],
  }) {
    this.isRoot = config.isRoot
    this.socialNetworks = [
      config.farcaster ? "Farcaster" : "",
      config.shortENS ? "ShortENS" : "",
      config.lens ? "Lens" : "",
      config.ENS ? "ENS" : "",
      config.github ? "Github" : "",
      config.twitter ? "Twitter" : "",
      config.gmail ? "Gmail" : "",
    ].filter(x => x != "")

    this.quadraticVouch = config.vouches ? config.vouches : []
    this.kycIDBoost = config.kycIDBoost ? config.kycIDBoost : ""

    this.inviter = config.inviter
    this.invitee = config.invitee

    this.currentScore = 0
  }

  baseSocialMediaScore(): number {
    let baseSocialMediaScore = 0;
    for (const socialNetwork of this.socialNetworks) {
      baseSocialMediaScore += SOCIAL_MEDIA_SCORE[socialNetwork]
    }

    return baseSocialMediaScore;
  }

  quadraticVouchingScore(): number {
    let quadraticVouchingScore = 0;
    for (const quadraticVouch of this.quadraticVouch) {
      quadraticVouchingScore += quadraticVouch * 0.01
    }

    return quadraticVouchingScore;
  }

  kycIDBoostScore(): number {
    const kycIDBoost = this.kycIDBoost ? KYC_ID_BOOST[this.kycIDBoost] : 1;
    return kycIDBoost;
  }

  walkupScore(): number {
    let networkWalkupScale = 1;
    let lastInviter = this.inviter;
    let steps = 1;
    while (lastInviter != null) {
      networkWalkupScale += 
        (
          lastInviter.score() - 
          GREEN_CHECKMARK_THRESHOLD
        ) 
          * 
        (
          1 - DECAY_FACTOR
        ) ** steps;

      steps++;            
      lastInviter = lastInviter.inviter;
    }

    return networkWalkupScale * WALKUP_DECAY;
  }

  walkdownScore(): number {
    let networkWalkdownScale = 1;
    let steps = 1;

    while (steps <= MAX_WALKDOWN_DEPTH) {
      for (const invitee of this.invitee) {
        networkWalkdownScale += 
          (
            invitee.score() - 
            GREEN_CHECKMARK_THRESHOLD
          ) 
            * 
          (
            1 - DECAY_FACTOR
          ) ** steps;
      }
      steps++;            
    }

    return networkWalkdownScale * WALKDOWN_DECAY;
  }

  score(): number {
    if (this.isRoot) {
      return 1
    }

    if (this.currentScore !== 0) {
      return this.currentScore
    }

    this.currentScore = (
      (this.baseSocialMediaScore() + this.quadraticVouchingScore())
        * this.kycIDBoostScore() 
        * this.walkupScore() 
        * this.walkdownScore()
    )

    return this.currentScore
  };

  tokenConsumption(): number {
    let tokenConsumption = 0;
    for (const quadraticVouch of this.quadraticVouch) {
        tokenConsumption += 2 ** quadraticVouch;
    }

    return tokenConsumption
  }

  noteInvite(profile: Profile) {
    this.invitee.push(profile)
  }

  isGreenCheckmarked(): boolean {
    return this.score() >= GREEN_CHECKMARK_THRESHOLD
  }
};