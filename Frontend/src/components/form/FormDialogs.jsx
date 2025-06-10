import { useState } from 'react';
import ConfirmDialog from '../ux/Confirm/ConfirmDialog';

export function FormDialogs({ onDeleteQuestion, onClearForm, formLink, showFormLinkDialog, onFormLinkClose }) {
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const confirmDeleteQuestion = (id) => {
    setQuestionToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (questionToDelete) {
      onDeleteQuestion(questionToDelete);
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const confirmClearForm = () => {
    setShowLeaveConfirm(true);
  };

  const handleClearConfirm = () => {
    onClearForm();
    setShowLeaveConfirm(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formLink);
    onFormLinkClose();
  };

  return {
    confirmDeleteQuestion,
    confirmClearForm,
    dialogs: (
      <>
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />

        <ConfirmDialog
          isOpen={showLeaveConfirm}
          title="Clear Form"
          message="You have unsaved changes. Are you sure you want to clear this form? All your data will be lost."
          confirmText="Clear Form"
          onConfirm={handleClearConfirm}
          onCancel={() => setShowLeaveConfirm(false)}
        />

        <ConfirmDialog
          isOpen={showFormLinkDialog}
          title="Form Link"
          message={formLink}
          confirmText="Copy Link"
          onConfirm={handleCopyLink}
          onCancel={onFormLinkClose}
        />
      </>
    )
  };
} 