import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';
import { toNumberSafe } from '../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * useMarketData
 * Loads Market_Data records once with selected columns and exposes data plus filters.
 */
export default function useMarketData() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters (controlled in App)
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('Marktet_Data')
          .select('Campaign_ID, Company, Campaign_Type, Target_Audience, Duration, Channel_Used, Conversion_Rate, Acquisition_Cost, ROI, Location, Language, Clicks, Impressions, Engagement_Score, Customer_Segment, Date')
          .range(0, 19999); // fetch up to 20k rows; charts aggregate client-side

        if (error) throw error;

        const normalized = (Array.isArray(data) ? data : []).map(r => ({
          ...r,
          Conversion_Rate: typeof r.Conversion_Rate === 'number' ? r.Conversion_Rate : toNumberSafe(r.Conversion_Rate),
          ROI: typeof r.ROI === 'number' ? r.ROI : toNumberSafe(r.ROI),
          Clicks: typeof r.Clicks === 'number' ? r.Clicks : toNumberSafe(r.Clicks),
          Impressions: typeof r.Impressions === 'number' ? r.Impressions : toNumberSafe(r.Impressions),
          Engagement_Score: typeof r.Engagement_Score === 'number' ? r.Engagement_Score : toNumberSafe(r.Engagement_Score),
          Acquisition_Cost: toNumberSafe(r.Acquisition_Cost),
        }));
        if (!cancelled) setRows(normalized);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load Market_Data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filters = {
    search, setSearch,
    channelFilter, setChannelFilter,
    audienceFilter, setAudienceFilter,
    segmentFilter, setSegmentFilter,
    locationFilter, setLocationFilter,
    languageFilter, setLanguageFilter,
  };

  const allChannels = useMemo(() => Array.from(new Set(rows.map(r => r.Channel_Used || 'Unknown'))), [rows]);
  const allAudiences = useMemo(() => Array.from(new Set(rows.map(r => r.Target_Audience || 'Unknown'))), [rows]);
  const allSegments = useMemo(() => Array.from(new Set(rows.map(r => r.Customer_Segment || 'Unknown'))), [rows]);
  const allLocations = useMemo(() => Array.from(new Set(rows.map(r => r.Location || 'Unknown'))), [rows]);
  const allLanguages = useMemo(() => Array.from(new Set(rows.map(r => r.Language || 'Unknown'))), [rows]);

  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter(r => {
      if (channelFilter !== 'All' && (r.Channel_Used || 'Unknown') !== channelFilter) return false;
      if (audienceFilter !== 'All' && (r.Target_Audience || 'Unknown') !== audienceFilter) return false;
      if (segmentFilter !== 'All' && (r.Customer_Segment || 'Unknown') !== segmentFilter) return false;
      if (locationFilter !== 'All' && (r.Location || 'Unknown') !== locationFilter) return false;
      if (languageFilter !== 'All' && (r.Language || 'Unknown') !== languageFilter) return false;
      if (s) {
        const hay = [
          r.Company, r.Campaign_Type, r.Target_Audience, r.Channel_Used,
          r.Location, r.Language, r.Customer_Segment, r.Duration
        ].map(x => String(x ?? '').toLowerCase()).join('|');
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [rows, search, channelFilter, audienceFilter, segmentFilter, locationFilter, languageFilter]);

  return {
    loading, error, rows, filteredRows,
    allChannels, allAudiences, allSegments, allLocations, allLanguages,
    filters
  };
}
