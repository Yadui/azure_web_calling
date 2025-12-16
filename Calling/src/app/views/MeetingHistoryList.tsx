import React, { useEffect, useState } from 'react';
import { Stack, Text, IconButton, mergeStyles } from '@fluentui/react';
import { getMeetingHistory, MeetingHistoryItem } from '../utils/localStorage';

const historyContainerStyle = mergeStyles({
    width: '100%',
    maxWidth: '20rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
});

const itemStyle = mergeStyles({
    padding: '0.5rem 0',
    borderBottom: '1px solid #edebe9',
    selectors: {
        ':last-child': {
            borderBottom: 'none'
        }
    }
});

const PAGINATION_SIZE = 3;

export const MeetingHistoryList = (): JSX.Element => {
    const [history, setHistory] = useState<MeetingHistoryItem[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        // Refresh history periodically or on focus could be improved, but for now just on mount
        setHistory(getMeetingHistory());
    }, []);

    const totalPages = Math.ceil(history.length / PAGINATION_SIZE);
    const currentItems = history.slice(page * PAGINATION_SIZE, (page + 1) * PAGINATION_SIZE);

    if (history.length === 0) return <></>;

    return (
        <Stack className={historyContainerStyle}>
            <Text variant="large" styles={{ root: { fontWeight: 600, marginBottom: '0.5rem' } }}>
                Meeting History
            </Text>
            <Stack>
                {currentItems.map((item) => (
                    <Stack key={item.id} className={itemStyle}>
                        <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
                            {item.callDescription}
                        </Text>
                        <Text variant="small" style={{ color: '#666' }}>
                            {new Date(item.timestamp).toLocaleString()}
                        </Text>
                    </Stack>
                ))}
            </Stack>
            {totalPages > 1 && (
                <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginTop: '0.5rem' } }}>
                    <IconButton
                        iconProps={{ iconName: 'ChevronLeft' }}
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        ariaLabel="Previous page"
                    />
                    <Text variant="small" styles={{ root: { alignSelf: 'center' } }}>
                        {page + 1} / {totalPages}
                    </Text>
                    <IconButton
                        iconProps={{ iconName: 'ChevronRight' }}
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(page + 1)}
                        ariaLabel="Next page"
                    />
                </Stack>
            )}
        </Stack>
    );
};
