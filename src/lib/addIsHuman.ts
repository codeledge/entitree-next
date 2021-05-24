import { FICTIONAL_HUMAN_ID, HUMAN_ID } from "constants/entities";

import { BigEntity } from "types/Entity";
import { INSTANCE_OF_ID } from "constants/properties";

export default function addIsHuman(entity: BigEntity) {
  try {
    entity.isHuman = entity.simpleClaims?.[INSTANCE_OF_ID]?.some(
      ({ value }) => value === HUMAN_ID || value === FICTIONAL_HUMAN_ID,
    );
    return undefined;
  } catch (error) {
    return undefined;
  }
}
