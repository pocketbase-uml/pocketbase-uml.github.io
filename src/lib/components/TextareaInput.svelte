<script lang="ts">
  import InputLabel from './InputLabel.svelte';

  interface Props {
    label: string;
    rows?: number | undefined;
    code?: boolean;
    value?: string;
    placeholder?: string | undefined;
    spellcheck?: boolean;
    required?: boolean;
  }

  let {
    label,
    rows = undefined,
    code = false,
    value = $bindable(''),
    placeholder = undefined,
    spellcheck = false,
    required = false
  }: Props = $props();

  const handleInput = (e: Event) => {
    value = (e.target as HTMLInputElement).value;
  };
</script>

<label>
  <InputLabel value={label} {required} />
  <textarea class:code {rows} {value} oninput={handleInput} {placeholder} {spellcheck} {required}
  ></textarea>
</label>

<style lang="scss">
  @use '../style/variables' as *;

  label {
    display: flex;
    flex-direction: column;
    background: $color-shade-1;
    border-radius: $border-radius;
    transition: background 0.25s;
    @media (pointer: fine) {
      &:hover {
        background: $color-shade-2;
      }
    }
    &:focus-within {
      background: $color-shade-3;
    }
  }

  textarea {
    padding: 0 15px 8px;
    font-size: $font-size-small;
    line-height: $line-height-input;
    scrollbar-color: rgba($color-text, 30%) rgba($color-text, 5%);
    &::placeholder {
      font-style: italic;
      color: $color-text-light;
    }
    &::-webkit-scrollbar {
      width: 0.6em;
    }
    &::-webkit-scrollbar-track {
      background: rgba($color-text, 5%);
      border-radius: $border-radius;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba($color-text, 30%);
      border-radius: $border-radius;
    }
    &.code {
      font-family: $font-family-monospace;
    }
  }
</style>
