# Market_Data Dashboard Catalog

This dashboard implements 30+ analytical widgets using Recharts with Ocean Professional styling.

Data source:
- Supabase table: public."Marktet_Data"
- Env vars: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY

Widgets:
1. KPIOverview — KPIs for total, companies, avg conversion, avg ROI, total clicks, impressions.
2. DashboardChart — Grouped bar (Audience vs Channels).
3. ChannelShareDonut — Donut of channel share (filtered).
4. ConversionRateTrend — Avg conversion rate over time.
5. ImpressionsTrend — Sum impressions over time.
6. ClicksTrend — Sum clicks over time.
7. CTRTrend — CTR over time (clicks/imp).
8. ROITrend — Avg ROI over time.
9. ROIBox — ROI min/median/max KPIs.
10. DailyVolumeArea — Records per day.
11. Rolling7DayAvgLine — Smoothed clicks.
12. ChannelPerformanceBar — Per-channel avg conv% and ROI.
13. AudienceConversionBar — Per-audience avg conv% and count.
14. SegmentROIBar — Avg ROI by customer segment.
15. LocationLanguageHeatmap — Stacked proxy heatmap: language within location.
16. CampaignTypeSharePie — Campaign type distribution.
17. AcquisitionCostHistogram — Histogram of acquisition cost.
18. ConversionVsROIScatter — Scatter + correlation.
19. ClicksVsImpressionsScatter — Scatter + correlation.
20. EngagementVsROIScatter — Scatter + correlation.
21. ChannelEfficiencyRadar — Radar of normalized metrics per channel.
22. AudienceChannelMatrix — Stacked counts by audience/channel.
23. SegmentChannelStacked — Stacked counts by segment/channel.
24. LanguageShareBar — Count by language.
25. LocationShareBar — Count by location.
26. CampaignTypePerformance — Avg conv/ROI/engagement by type.
27. FunnelClicksToConversions — Impressions→Clicks→Conversions (estimated).
28. ROIByLocationBar — Avg ROI by location.
29. ROIByChannelBar — Avg ROI by channel.
30. ConversionByChannelBar — Avg conv% by channel.
31. ConversionByAudienceBar — Avg conv% by audience.
32. EngagementByChannelBar — Avg engagement by channel.
33. EngagementByAudienceBar — Avg engagement by audience.
34. AudienceChannelTrends — Existing time trend (channels across date).
35. ChannelSharePie — Existing simple channel share pie.
36. AudienceScatter — Existing bubble audience vs channel.
37. MarketDataTable — Data table with pagination.

Performance:
- Client-side aggregation with fetch cap (useMarketData loads up to 20k rows).
- For very large datasets, create server-side materialized views or RPCs for pre-aggregation and update components to read those.

Extending:
- Add a new widget in src/components/analytics/widgets/.
- Export it via src/components/analytics/index.js.
- Place it in App.js under the desired section.
