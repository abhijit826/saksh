import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Import as Passport, FileText, Plus, Edit, Trash2, Lock, Shield, AlertCircle } from 'lucide-react';
import { TravelDocument } from '../types';

// Mock data for travel documents
const mockDocuments: TravelDocument[] = [
  {
    type: 'passport',
    id: 'doc-1',
    number: 'P12345678',
    expiryDate: '2028-05-15',
    country: 'United States',
  },
  {
    type: 'visa',
    id: 'doc-2',
    number: 'V87654321',
    expiryDate: '2023-12-10',
    country: 'Japan',
    embassy: {
      name: 'Embassy of Japan in the United States',
      address: '2520 Massachusetts Avenue NW, Washington, DC 20008',
      phone: '+1 202-238-6700',
      email: 'info@us.emb-japan.go.jp',
    },
  },
  {
    type: 'creditCard',
    id: 'doc-3',
    number: '**** **** **** 4321',
    expiryDate: '2026-09-30',
  },
];

const TravelWallet: React.FC = () => {
  const [documents, setDocuments] = useState<TravelDocument[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<TravelDocument | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TravelDocument>>({
    type: 'passport',
    number: '',
    expiryDate: '',
    country: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport':
        return <Passport className="h-6 w-6 text-blue-500" />;
      case 'visa':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'creditCard':
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'passport':
        return 'Passport';
      case 'visa':
        return 'Visa';
      case 'creditCard':
        return 'Credit Card';
      default:
        return 'Document';
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const monthsUntilExpiry = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
    
    if (expiry < now) {
      return { status: 'expired', className: 'bg-red-100 text-red-800' };
    } else if (monthsUntilExpiry <= 3) {
      return { status: 'expiring soon', className: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'valid', className: 'bg-green-100 text-green-800' };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'passport',
      number: '',
      expiryDate: '',
      country: '',
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleAddDocument = () => {
    if (!formData.number || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newDocument: TravelDocument = {
      id: `doc-${Date.now()}`,
      type: formData.type as 'passport' | 'visa' | 'creditCard',
      number: formData.number,
      expiryDate: formData.expiryDate,
      country: formData.country,
    };

    // Add embassy details for visa
    if (formData.type === 'visa' && formData.country) {
      newDocument.embassy = {
        name: `Embassy of ${formData.country}`,
        address: 'Address will be fetched from API',
        phone: '+1 123-456-7890',
        email: `info@${formData.country.toLowerCase().replace(/\s+/g, '')}.embassy.com`,
      };
    }

    setDocuments([...documents, newDocument]);
    setSelectedDocument(newDocument);
    resetForm();
  };

  const handleEditDocument = () => {
    if (!selectedDocument || !formData.number || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedDocuments = documents.map(doc => {
      if (doc.id === selectedDocument.id) {
        const updatedDoc: TravelDocument = {
          ...doc,
          type: formData.type as 'passport' | 'visa' | 'creditCard',
          number: formData.number,
          expiryDate: formData.expiryDate,
          country: formData.country,
        };

        // Update embassy details for visa
        if (formData.type === 'visa' && formData.country) {
          updatedDoc.embassy = doc.embassy || {
            name: `Embassy of ${formData.country}`,
            address: 'Address will be fetched from API',
            phone: '+1 123-456-7890',
            email: `info@${formData.country.toLowerCase().replace(/\s+/g, '')}.embassy.com`,
          };
        } else {
          delete updatedDoc.embassy;
        }

        return updatedDoc;
      }
      return doc;
    });

    setDocuments(updatedDocuments);
    setSelectedDocument(updatedDocuments.find(doc => doc.id === selectedDocument.id) || null);
    setShowEditForm(false);
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;

    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    setSelectedDocument(null);
    setShowDeleteConfirm(false);
  };

  const startEditDocument = () => {
    if (!selectedDocument) return;

    setFormData({
      type: selectedDocument.type,
      number: selectedDocument.number,
      expiryDate: selectedDocument.expiryDate,
      country: selectedDocument.country || '',
    });
    setShowEditForm(true);
  };

  const renderForm = () => (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="passport">Passport</option>
          <option value="visa">Visa</option>
          <option value="creditCard">Credit Card</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Number
        </label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter document number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date
        </label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {(formData.type === 'passport' || formData.type === 'visa') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter country"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={showEditForm ? handleEditDocument : handleAddDocument}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {showEditForm ? 'Update Document' : 'Add Document'}
        </button>
      </div>
    </form>
  );

  const renderDeleteConfirmation = () => (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this {selectedDocument?.type}? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteDocument}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Wallet</h1>
        <p className="text-gray-600">
          Securely store and manage your travel documents, credit cards, passports, and visas in one place.
        </p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-6 mb-8">
        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium text-gray-900">Blockchain-Secured Documents</h2>
            <p className="text-gray-600 mt-1">
              Your documents are encrypted and secured using blockchain technology. Only you have access to your sensitive information.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Documents</h2>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setShowEditForm(false);
                  setSelectedDocument(null);
                }}
                className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200"
                title="Add new document"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No documents yet. Add your first document.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => {
                  const expiryStatus = getExpiryStatus(doc.expiryDate);
                  
                  return (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg cursor-pointer ${
                        selectedDocument?.id === doc.id
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowAddForm(false);
                        setShowEditForm(false);
                        setShowDeleteConfirm(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium text-gray-900">{getDocumentTitle(doc.type)}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${expiryStatus.className}`}>
                              {expiryStatus.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDocument && !showEditForm && !showDeleteConfirm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    {getDocumentIcon(selectedDocument.type)}
                    <h2 className="text-2xl font-bold text-gray-900 ml-2">
                      {getDocumentTitle(selectedDocument.type)}
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      onClick={startEditDocument}
                      title="Edit document"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      onClick={() => setShowDeleteConfirm(true)}
                      title="Delete document"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Document Number</p>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">{selectedDocument.number}</p>
                        <Lock className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(selectedDocument.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedDocument.country && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Country</p>
                        <p className="text-lg font-medium text-gray-900">{selectedDocument.country}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDocument.type === 'visa' && selectedDocument.embassy && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Embassy Information</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="font-medium text-gray-900">{selectedDocument.embassy.name}</p>
                      <p className="text-gray-600 mt-1">{selectedDocument.embassy.address}</p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-gray-600">
                          <span>Phone: {selectedDocument.embassy.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span>Email: {selectedDocument.embassy.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDocument.type === 'visa' && getExpiryStatus(selectedDocument.expiryDate).status !== 'valid' && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Visa Expiring Soon</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your visa for {selectedDocument.country} is expiring on {new Date(selectedDocument.expiryDate).toLocaleDateString()}. Consider renewing it if you plan to travel again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : showAddForm || showEditForm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showEditForm ? 'Edit Document' : 'Add New Document'}
                  </h2>
                </div>
                {renderForm()}
              </div>
            </motion.div>
          ) : showDeleteConfirm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              {renderDeleteConfirmation()}
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                  <CreditCard className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Document</h3>
                <p className="text-gray-500 mb-6">
                  Choose a document from the list to view details or add a new one.
                </p>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setShowEditForm(false);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Add New Document</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelWallet;