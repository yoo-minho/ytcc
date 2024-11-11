import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
});

const ytcc = 461504883;
const customcol = 439414170;
const cutin = 418194228;
const teamlog = 351493808;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = query.type as keyof typeof properties;

  const properties = {
    ytcc: ytcc,
    customcol: customcol,
    cutin: cutin,
    teamlog: teamlog,
  };
  const property = properties[type] || ytcc;

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${property}`,
    dimensions: [{ name: "yearMonth" }],
    metrics: [{ name: "activeUsers" }],
    dateRanges: [
      {
        startDate: "2023-01-01",
        endDate: "2024-12-31",
      },
    ],
    orderBys: [
      {
        dimension: {
          dimensionName: "yearMonth",
        },
        desc: false,
      },
    ],
  });

  return response;
});
