import { Entity, EntityProp, GeniEntity } from "types/Entity";

import { LangCode } from "types/Lang";
import { WikibaseAlias } from "wikibase/getWikibaseInstance";
import { getRootEntity } from "geni/lib/getEntities";

export const loadEntity = async ({
  itemId,
  langCode,
  geniAccessToken,
}: {
  itemId: string;
  wikibaseAlias: WikibaseAlias;
  langCode: LangCode;
  geniAccessToken: string;
}): Promise<{
  currentEntity: GeniEntity;
}> => {
  const currentEntity = await getRootEntity(itemId, langCode, {
    wikibaseAlias: "geni",
    addUpIds: true,
    addDownIds: true,
    addLeftIds: false,
    addRightIds: false,
    // serverside: true,
    geniAccessToken,
  });

  return { currentEntity };
};
