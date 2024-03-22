export const GET_TOUR_RESPONSE = {
  id: true,
  name: true,
  encodeUrl: true,
  config: {
    select: {
      privacyStatus: true,
    },
  },
  category: true,
  description: true,
  socialImage: true,
  creatorId: true,
  statistic: {
    select: {
      likeCount: true,
      viewCount: true,
    },
  },
  createdAt: true,
};

export const GET_TOUR_BY_CREATOR_RESPONSE = {
  id: true,
  name: true,
  addressName: true,
  location: true,
  description: true,
  socialImage: true,
  category: true,
  createdAt: true,
  modifiedAt: true,
  encodeUrl: true,
  statistic: true,
  creator: true,
  config: true,
};
