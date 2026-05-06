'use client';
import { useTrackView } from '@/hooks/public/useTrackView';

export default function TrackPageView({ page_type, ref_id, ref_slug }) {
    useTrackView({ page_type, ref_id, ref_slug });
    return null; // Không render gì
}