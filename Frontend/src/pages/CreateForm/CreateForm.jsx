import { useNavigate } from "react-router-dom";
import styles from './CreateForm.module.css';
import FormTitle from '../../components/FormTitle/FormTitle';
import Notification from '../../components/ux/Notification/Notification';
import { useFormState } from '../../hooks/useFormState';
import { useFormSave } from '../../hooks/useFormSave';
import { FormDialogs } from '../../components/form/FormDialogs';
import { DraggableQuestionList } from '../../components/form/DraggableQuestionList';

function CreateForm({ logged }) {
  const navigate = useNavigate();
  
  const {
    title, setTitle,
    description, setDescription,
    questions, setQuestions,
    notification, setNotification,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    clearForm,
    showNotification
  } = useFormState();
  
  const {
    isLoading,
    formLink,
    showFormLinkDialog,
    setShowFormLinkDialog,
    handleSaveForm
  } = useFormSave((message, type) => showNotification(message, type));
  ///////////////////////////////////////////////////////////////////////////////// Form del both
  const { confirmDeleteQuestion, confirmClearForm, dialogs } = FormDialogs({
    onDeleteQuestion: (id) => {
      deleteQuestion(id);
      showNotification('Question deleted successfully', 'success');
    },
    onClearForm: () => {
      clearForm();
      showNotification('Form cleared', 'info');
    },
    formLink: formLink,
    showFormLinkDialog: showFormLinkDialog,
    onFormLinkClose: () => setShowFormLinkDialog(false)
  });
  /////////////////////////////////////////////////////////////////////////////////
  const authCheck = () => {
    if (!logged) {
      navigate("/auth");
    }
  };
  
  const onSaveForm = () => {
    authCheck();
    handleSaveForm(title, description, questions);
  };
  
  return (
    <div className={styles.container}>
      <h1>Create a New Form</h1>

      <Notification 
        message={notification.message} 
        type={notification.type}
        id={notification.id}
        onClose={() => setNotification({ message: '', type: '', id: null })}
      />
      
      {dialogs}

      <div className={styles.formBuilder}>
        <FormTitle 
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <div>
          {questions.length > 0 ? (
            <DraggableQuestionList
              questions={questions}
              onQuestionChange={updateQuestion}
              onQuestionDelete={confirmDeleteQuestion}
              onReorder={reorderQuestions}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>No questions yet. Click "Add Question" to start building your form.</p>
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button onClick={addQuestion} className={styles.addButton}>
            Add Question
          </button>
          <button 
            onClick={onSaveForm} 
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Form'}
          </button>
          <button onClick={confirmClearForm} className={styles.clearButton}>
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateForm;