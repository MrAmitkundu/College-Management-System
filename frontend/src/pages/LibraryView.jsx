import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { libraryBooks as initialBooks } from '../data/mockData';
import LibraryFilterBar from '../components/library/LibraryFilterBar';
import LibraryTable from '../components/library/LibraryTable';
import AddBookModal from '../components/library/AddBookModal';

export default function LibraryView() {
  const [books, setBooks] = useState(initialBooks);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', ...new Set(books.map((b) => b.category))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddBook = (newBookData) => {
    setBooks([newBookData, ...books]);
  };

  const handleToggleStatus = (isbn) => {
    setBooks(
      books.map((book) =>
        book.isbn === isbn
          ? { ...book, status: book.status === 'Available' ? 'Issued' : 'Available' }
          : book
      )
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Library Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredBooks.length} of {books.length} books in inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-purple-50 text-[#7C4DFF] border border-purple-200'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#7C4DFF]" />}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#7C4DFF] hover:bg-purple-700 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </div>

      {/* Collapsible Filter Bar */}
      {showFilters && (
        <LibraryFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          categories={categories}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Catalog Table */}
      <LibraryTable
        books={filteredBooks}
        onToggleStatus={handleToggleStatus}
        onResetFilters={resetFilters}
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
}