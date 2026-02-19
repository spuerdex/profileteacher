'use client';

import { useState } from 'react';
import Cite from 'citation-js';

export default function BibtexModal({ isOpen, onClose, onImport }) {
    const [bibtex, setBibtex] = useState('');
    const [preview, setPreview] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const parseBibtex = async () => {
        setError(null);
        setPreview([]);
        setLoading(true);

        if (!bibtex.trim()) {
            setError('Please paste BibTeX code.');
            setLoading(false);
            return;
        }

        try {
            // Use async parsing which is more robust
            const citations = await Cite.async(bibtex).catch(err => {
                throw new Error('This format is not supported or recognized. Please check your BibTeX code.');
            });

            const data = citations.data;

            if (!data || data.length === 0) {
                setError('No valid BibTeX entries found.');
                setLoading(false);
                return;
            }

            // Map to our database structure
            const mappedData = data.map(entry => ({
                titleTh: entry.title,
                titleEn: entry.title, // Default to same title, user can edit later
                journal: entry['container-title'] || entry.journal || entry.publisher,
                year: entry.issued?.['date-parts']?.[0]?.[0] ? parseInt(entry.issued['date-parts'][0][0]) : null,
                doi: entry.DOI,
                link: entry.URL,
            }));

            setPreview(mappedData);
        } catch (err) {
            console.error('BibTeX Parse Error:', err);
            setError(err.message || 'Invalid BibTeX format. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        setLoading(true);
        try {
            await onImport(preview);
            onClose();
            setBibtex('');
            setPreview([]);
        } catch (err) {
            setError(err.message || 'Import failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h3 className="modal-title">📥 Import from BibTeX</h3>
                    <button onClick={onClose} className="modal-close">✕</button>
                </div>

                {/* Content */}
                <div className="py-4">
                    {!preview.length ? (
                        <div className="space-y-4">
                            <p className="form-label text-muted">
                                Paste your BibTeX code below (from Google Scholar, ResearchGate, etc.)
                            </p>
                            <textarea
                                className="form-textarea font-mono text-sm"
                                style={{ minHeight: '200px' }}
                                placeholder="@article{...}"
                                value={bibtex}
                                onChange={(e) => setBibtex(e.target.value)}
                            ></textarea>
                            {error && <p className="text-error text-sm mt-2">❌ {error}</p>}
                            <div className="modal-footer">
                                <button
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={parseBibtex}
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner spinner-white mr-2"></span>
                                            Parsing...
                                        </>
                                    ) : 'Preview'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-md">
                                <h4 className="font-bold text-primary">{preview.length} Entries found</h4>
                                <button
                                    onClick={() => setPreview([])}
                                    className="text-sm text-secondary hover:underline"
                                >
                                    ← Back to Edit
                                </button>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-md bg-secondary">
                                {preview.map((item, idx) => (
                                    <div key={idx} className="p-sm border-b border-light last:border-0 text-sm">
                                        <p className="font-bold truncate text-primary">{item.titleTh}</p>
                                        <p className="text-secondary">
                                            {item.journal} {item.year && `(${item.year})`}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Importing...' : `Import ${preview.length} Items`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
