import React, { useEffect, useState } from 'react';
import { Stack, Text, mergeStyles, Icon } from '@fluentui/react';
import { getMeetingHistory, MeetingHistoryItem } from '../utils/localStorage';

const dashboardContainerStyle = mergeStyles({
    width: '100%',
    maxWidth: '20rem',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
});

const activeItemStyle = mergeStyles({
    padding: '0.75rem',
    marginTop: '0.5rem',
    backgroundColor: '#f3f2f1',
    borderRadius: '4px',
    borderLeft: '4px solid #0078d4',
    transition: 'transform 0.2s',
    selectors: {
        ':hover': {
            transform: 'scale(1.02)',
            backgroundColor: '#edebe9',
            cursor: 'pointer'
        }
    }
});

const pillStyle = mergeStyles({
    backgroundColor: '#ccffd8',
    color: '#004c10',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'inline-block',
    marginBottom: '0.25rem'
});

export interface ActiveMeetingsDashboardProps {
    onJoin: (url: string) => void;
}

export const ActiveMeetingsDashboard = (props: ActiveMeetingsDashboardProps): JSX.Element => {
    const [activeMeetings, setActiveMeetings] = useState<MeetingHistoryItem[]>([]);

    useEffect(() => {
        const history = getMeetingHistory();
        // Show the recent meetings from history as "active" candidates
        // Filter out items that don't have a URL (legacy data) or are already ended
        // Only show meetings created by the user (not joined)
        const recentHistory = history.filter(item => item.url && item.status === 'live' && item.isCreated).slice(0, 2);
        setActiveMeetings(recentHistory);
    }, []);

    return (
        <Stack className={dashboardContainerStyle}>
            <Stack horizontal key="header" styles={{ root: { marginBottom: '0.5rem', alignItems: 'center' } }}>
                <Icon iconName="ViewDashboard" styles={{ root: { marginRight: '0.5rem', color: '#0078d4' } }} />
                <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                    Active Dashboard
                </Text>
            </Stack>

            <Text variant="small" style={{ color: '#666', marginBottom: '0.5rem' }}>
                Live sessions happening now
            </Text>

            <Stack>
                {activeMeetings.length === 0 && (
                    <Text variant="small" style={{ fontStyle: 'italic', padding: '0.5rem' }}>
                        No active meetings
                    </Text>
                )}
                {activeMeetings.map((meeting) => (
                    <Stack
                        key={meeting.id}
                        className={activeItemStyle}
                        onClick={() => props.onJoin(meeting.url)}
                    >
                        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                            <span className={pillStyle}>Live</span>
                        </Stack>
                        <Text variant="medium" styles={{ root: { fontWeight: 600, marginTop: '4px' } }}>
                            {meeting.callDescription}
                        </Text>
                        <Text variant="tiny" style={{ color: '#666' }}>
                            Started {new Date(meeting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};
