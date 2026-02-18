'use client';

import { useState } from 'react';
import Cite from 'citation-js';

export default function BibtexModal({ isOpen, onClose, onImport }) {
    const [bibtex, setBibtex] = useState('');
    const [preview, setPreview] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const parseBibtex = () => {
        setError(null);
        setPreview([]);

        if (!bibtex.trim()) {
            setError('Please paste BibTeX code.');
            return;
        }

        try {
            const citations = new Cite(bibtex);
            const data = citations.data;

            if (!data || data.length === 0) {
                setError('No valid BibTeX entries found.');
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
            console.error(err);
            setError('Invalid BibTeX format. Please check your input.');
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold">Import from BibTeX</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* content */}
                <div className="p-4 overflow-y-auto flex-1">
                    {!preview.length ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Paste your BibTeX code below (from Google Scholar, ResearchGate, etc.)
                            </p>
                            <textarea
                                className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="@article{...}"
                                value={bibtex}
                                onChange={(e) => setBibtex(e.target.value)}
                            ></textarea>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button
                                onClick={parseBibtex}
                                className="btn btn-primary w-full"
                            >
                                Preview
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-green-600">{preview.length} Entries found</h4>
                                <button
                                    onClick={() => setPreview([])}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Back to Edit
                                </button>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                                {preview.map((item, idx) => (
                                    <div key={idx} className="p-2 border-b last:border-0 text-sm">
                                        <p className="font-bold truncate">{item.titleTh}</p>
                                        <p className="text-gray-500">
                                            {item.journal} {item.year && `(${item.year})`}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
