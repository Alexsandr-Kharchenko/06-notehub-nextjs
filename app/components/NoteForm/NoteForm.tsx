'use client';

import { Formik, Form, Field, ErrorMessage as FE } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import styles from './NoteForm.module.css';
import type { Note } from '../../types/note';
import { createNote, type CreateNote } from '../../lib/api';

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500),
  tag: Yup.mixed<Note['tag']>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag required'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, CreateNote>({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
    onError: () => toast.error('Failed to create note'),
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as Note['tag'] }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        mutation.mutate(values);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={styles.input} />
            <FE name="title" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={styles.textarea}
            />
            <FE name="content" component="span" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FE name="tag" component="span" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
