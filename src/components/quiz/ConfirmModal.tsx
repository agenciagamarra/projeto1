import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unansweredCount: number;
  timeLeft: number;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  unansweredCount,
  timeLeft
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Quiz"
    >
      <div className="space-y-4">
        {unansweredCount > 0 ? (
          <div className="flex items-start space-x-2 text-yellow-600 bg-yellow-50 p-4 rounded-md">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>
              Warning: You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
              Unanswered questions will be marked as incorrect.
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            Are you sure you want to submit? You still have {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} remaining.
          </p>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Continue Quiz
          </Button>
          <Button
            onClick={onConfirm}
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </Modal>
  );
}