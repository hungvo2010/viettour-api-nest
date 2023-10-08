import { PrivacyStatus } from '@prisma/client';

const FIND_ONE_CONFIG_CONDITION = {
  config: {
    is: {
      OR: [
        {
          privacyStatus: PrivacyStatus.PUBLIC,
        },
        {
          privacyStatus: PrivacyStatus.UNLISTED,
        },
      ],
    },
  },
};

const INCLUDE_NESTED_SCENES = {
  include: {
    scenes: {
      include: {
        scene: {
          include: {
            containHotspots: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    },
  },
};

export { FIND_ONE_CONFIG_CONDITION, INCLUDE_NESTED_SCENES };
