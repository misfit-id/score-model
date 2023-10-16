import { 
  SOCIAL_MEDIA_SCORE,
  KYC_ID_BOOST,

  GREEN_CHECKMARK_THRESHOLD,
  VOTE_PRICE_ETH,
} from './consts'

export class Profile {
  isRoot: boolean

  socialNetworks: string[]
  quadraticVouch: number[]
  kycIDBoost: string

  inviter: Profile | undefined
  invitee: Profile[]

  baseScore: number = 0
  weightedScore: number = 0

  constructor(config: {
      isRoot: boolean,

      socialNetworks: string[]
      vouches?: number[],
      kycIDBoost?: string,

      inviter?: Profile,
      invitee?: Profile[],
  }) {
    this.isRoot = config.isRoot
    this.socialNetworks = config.socialNetworks;
    this.quadraticVouch = config.vouches ? config.vouches : []
    this.kycIDBoost = config.kycIDBoost ? config.kycIDBoost : ""

    this.inviter = config.inviter
    this.invitee = config.invitee ? config.invitee : [];
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

  score(update: boolean = false): number {
    if (this.isRoot) {
      return 1
    }

    if (update) {
      this.baseScore = (
        (this.baseSocialMediaScore() + this.quadraticVouchingScore())
          * this.kycIDBoostScore()
      )
    }

    return this.baseScore
  };

  finalScore(): number {
    if (this.isRoot) {
      return 1.5;
    }

    return this.weightedScore;
  }

  receiveVote(votes: number) {
    this.quadraticVouch.push(votes);
    this.score(true);
  }

  noteNetworkScore(walkupScale: number, walkdownScore: number) {
    this.weightedScore = walkupScale * walkdownScore * this.score();
  }

  tokenConsumption(): number {
    let tokenConsumption = 0;
    for (const quadraticVouch of this.quadraticVouch) {
        tokenConsumption += 2 ** quadraticVouch;
    }

    return tokenConsumption * VOTE_PRICE_ETH;
  }

  noteInvite(profile: Profile) {
    this.invitee.push(profile)
  }

  isGreenCheckmarked(): boolean {
    return this.finalScore() >= GREEN_CHECKMARK_THRESHOLD
  }
};