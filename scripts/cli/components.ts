import { colors } from '../common/colors.js';

const c = colors;

export const TEXT_FIELD_WIDTH = 20;

// ============================================
// Text Field Display
// ============================================
export interface TextFieldOptions {
  value: string;
  placeholder?: string;
  isSelected: boolean;
  showCursor: boolean;
}

export function renderTextField({ value, placeholder, isSelected, showCursor }: TextFieldOptions): string {
  const displayValue = value || '';
  const remaining = Math.max(0, TEXT_FIELD_WIDTH - displayValue.length);
  const underline = '_'.repeat(remaining);
  const cursor = (showCursor && isSelected) ? '▌' : '';
  
  if (value) {
    return `${c.cyan}${displayValue}${c.reset}${cursor}${c.dim}${underline}${c.reset}`;
  }
  
  const placeholderText = placeholder ?? '_'.repeat(TEXT_FIELD_WIDTH);
  return isSelected 
    ? `${c.dim}${placeholderText}${c.reset}▌`
    : `${c.dim}${placeholderText}${c.reset}`;
}

// ============================================
// Inline Text Field (for radio with custom option)
// ============================================
export interface InlineTextFieldOptions {
  value: string;
  isOnCustomOption: boolean;
  caretVisible?: boolean;
}

export function renderInlineTextField({ value, isOnCustomOption, caretVisible = true }: InlineTextFieldOptions): string {
  const displayValue = value || '';
  const remaining = Math.max(0, TEXT_FIELD_WIDTH - displayValue.length);
  const underline = '_'.repeat(remaining);
  
  if (isOnCustomOption) {
    const caret = caretVisible ? '▌' : ' ';
    return `${c.cyan}${displayValue}${c.reset}${caret}${c.dim}${underline}${c.reset}`;
  }
  
  if (value) {
    return `${c.cyan}${displayValue}${c.reset}${c.dim}${underline}${c.reset}`;
  }
  
  return `${c.dim}${'_'.repeat(TEXT_FIELD_WIDTH)}${c.reset}`;
}
