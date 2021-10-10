import React, { useEffect } from "react";
import {
  setCurrentEntity,
  setCurrentEntityProps,
  setCurrentProp,
} from "store/treeSlice";
import { useAppSelector, wrapper } from "store";

import { DEFAULT_PROPERTY_ALL } from "constants/properties";
import Div100vh from "react-div-100vh";
import DrawingArea from "components/DrawingArea";
import Error from "next/error";
import Footer from "layout/Footer";
import { HeadMeta } from "layout/HeadMeta";
import Header from "layout/Header";
import { LANGS } from "constants/langs";
import { LangCode } from "types/Lang";
import SearchBar from "layout/SearchBar";
import TreeLoader from "layout/TreeLoader";
import { createMetaTags } from "seo/createMetaTags";
import { errorHandler } from "handlers/errorHandler";
import { isItemId } from "helpers/isItemId";
import { loadEntity } from "treeHelpers/loadEntity";
import { setSetting } from "store/settingsSlice";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const TreePage = ({
  errorCode,
  ogDescription,
  ogImage,
  ogTitle,
  twitterCard,
  twitterDescription,
  twitterImage,
  twitterTitle,
  langCode,
}) => {
  const { loadingEntity } = useAppSelector(({ tree }) => tree);

  const dispatch = useDispatch();

  // force settings to be as url, otherwise you get a mix up
  useEffect(() => {
    dispatch(setSetting({ languageCode: langCode, wikibaseAlias: "factgrid" }));
  }, []);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <>
      <HeadMeta
        ogDescription={ogDescription}
        ogImage={ogImage}
        ogTitle={ogTitle}
        twitterCard={twitterCard}
        twitterDescription={twitterDescription}
        twitterImage={twitterImage}
        twitterTitle={twitterTitle}
      />
      <Page>
        <Header />
        <SearchBar />
        {loadingEntity ? <TreeLoader /> : <DrawingArea />}
      </Page>
      <Footer />
    </>
  );
};

const Page = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`;

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store: { dispatch }, query }) => {
    const { langCode, propSlug, itemSlug } = query as {
      langCode: LangCode;
      propSlug: string;
      itemSlug: string;
    };

    if (!LANGS.find(({ code }) => code === langCode))
      return { props: { errorCode: 404 } };

    const decodedPropSlug = decodeURIComponent(propSlug);

    let itemId;
    if (isItemId(itemSlug)) {
      itemId = itemSlug;
    } else {
      return { props: { errorCode: 404, message: "Slug must be a QID" } };
    }

    try {
      const { currentEntity, currentProp, itemProps } = await loadEntity({
        itemId,
        wikibaseAlias: "factgrid",
        langCode,
        propSlug: decodedPropSlug,
      });

      if (!currentEntity) return { props: { errorCode: 404 } };

      //redirect to "all" if prop not found
      if (propSlug !== DEFAULT_PROPERTY_ALL && !currentProp) {
        return {
          redirect: {
            destination: `/factgrid/${langCode}/${DEFAULT_PROPERTY_ALL}/${itemSlug}`,
          },
        };
      }

      dispatch(setCurrentEntity(currentEntity));
      if (itemProps) dispatch(setCurrentEntityProps(itemProps));
      if (currentProp) dispatch(setCurrentProp(currentProp));

      const { ogDescription, ogTitle } = createMetaTags(
        langCode,
        currentEntity,
        currentProp,
      );

      const ogImage = "icons/entitree_square.png";
      const twitterCard = "summary";

      return {
        props: { ogTitle, ogImage, twitterCard, ogDescription, langCode },
      };
    } catch (error: any) {
      errorHandler(error);

      return { props: { errorCode: error.response?.status || 500 } };
    }
  },
);

export default TreePage;
