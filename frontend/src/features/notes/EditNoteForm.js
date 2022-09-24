import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const EditNoteForm = ({ note, users }) => {
  useTitle(`Dan D. Repairs | Edit Note #${note.ticket}`);
  const { isManager, isAdmin } = useAuth();

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [userId, setUserId] = useState(note.user);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, user: userId, title, text, completed });
    }
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const created = new Date(note.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const updated = new Date(note.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';

  const errContent = (error?.data?.message || delError?.data?.message) ?? '';

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className='icon-button'
        title='Delete'
        onClick={onDeleteNoteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form onSubmit={(e) => e.preventDefault()} className='form'>
        <div className='form__title-row'>
          <h2>Edit Note #{note.ticket}</h2>
          <div className='form__action-buttons'>
            <button
              className='icon-button'
              title='Save'
              disabled={!canSave}
              onClick={onSaveNoteClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label htmlFor='note-title' className='form__label'>
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          type='text'
          id='note-title'
          name='title'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='note-text' className='form__label'>
          Description:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id='note-text'
          name='text'
          value={text}
          onChange={onTextChanged}
        />
        <div className='form__row'>
          <div className='form__divider'>
            <label
              htmlFor='note-completed'
              className='form__label form__checkbox-container'
            >
              WORK COMPLETE:
            </label>
            <input
              type='checkbox'
              className='form__checkbox'
              id='note-completed'
              name='completed'
              checked={completed}
              onChange={onCompletedChanged}
            />
            <label
              htmlFor='note-username'
              className='form__label form__checkbox-container'
            >
              ASSIGNED TO:
            </label>
            <select
              name='username'
              id='note-username'
              className='form__select'
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className='form__divider'>
            <p className='form__created'>
              Created: <br />
              {created}
            </p>
            <p className='form__updateded'>
              Updated: <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
