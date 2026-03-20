import React, { createContext, useState, useContext, useEffect } from 'react';


const IssueContext = createContext();

export function IssueProvider({ children }) {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get API URL from environment variables or fallback to localhost
    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fetch issues from backend
    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${API_URL}/api/issues`);
            if (!response.ok) throw new Error('Failed to fetch issues');
            const data = await response.json();
            setIssues(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Update the status of a specific issue
    const updateIssueStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/issues/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedIssue = await response.json();
                setIssues(prevIssues =>
                    prevIssues.map(issue =>
                        (issue._id === id || issue.id === id) ? { ...issue, status: newStatus } : issue
                    )
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error updating status:", err);
            return false;
        }
    };

    // Add a new issue
    const addIssue = async (newIssue) => {
        try {
            const response = await fetch(`${API_URL}/api/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newIssue),
            });

            if (response.ok) {
                const savedIssue = await response.json();
                setIssues(prev => [savedIssue, ...prev]);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error adding issue:", err);
            return false;
        }
    };

    return (
        <IssueContext.Provider value={{ issues, loading, error, updateIssueStatus, addIssue }}>
            {children}
        </IssueContext.Provider>
    );
}

export function useIssues() {
    const context = useContext(IssueContext);
    if (!context) {
        throw new Error('useIssues must be used within an IssueProvider');
    }
    return context;
}
