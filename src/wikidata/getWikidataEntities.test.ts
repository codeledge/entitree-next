import getWikidataEntities from "./getWikidataEntities";

describe("getWikidataEntities", () => {
  test("it should get universe", async () => {
    const id = "Q1";
    const res = await getWikidataEntities({ ids: [id] });
    expect(res[id].id).toBe(id);
    expect(res["123"]).toBeUndefined();
  });

  test("it should get languaged", async () => {
    const id = "Q1";
    const res = await getWikidataEntities({
      ids: [id],
      languages: ["fr", "de"],
    });
    expect(res[id].labels?.fr).not.toBeUndefined();
    expect(res[id].labels?.de).not.toBeUndefined();
    expect(res[id].labels?.en).toBeUndefined();
  });

  test("it should get props", async () => {
    const id = "Q1";
    const res = await getWikidataEntities({
      ids: [id],
      props: ["labels"],
    });
    expect(res[id].labels).not.toBeUndefined();
    expect(res[id].descriptions).toBeUndefined();
  });

  test("getItems with 50 elements limit", async () => {
    const ids: string[] = [];
    for (let index = 1; index <= 51; index += 1) {
      ids.push(`Q${index}`);
    }
    const entitties = await getWikidataEntities({ ids, props: [] });
    expect(entitties[ids[0]].labels?.en.value).toBe("universe");
    expect(entitties.Q47["missing"]).toBe("");
    expect(entitties[ids[ids.length - 1]].labels?.en.value).toBe("Antarctica");
  }, 40000); // usually done in ~30s
});
