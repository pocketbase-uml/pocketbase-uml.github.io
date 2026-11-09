<script lang="ts">
  import InputLabel from './InputLabel.svelte';

  interface Props {
    label: string;
    value?: string;
    type?: 'url' | 'email' | 'password' | undefined;
    placeholder?: string | undefined;
    spellcheck?: boolean;
    required?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    type = undefined,
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
  <input {type} {value} oninput={handleInput} {placeholder} {spellcheck} {required} />
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

  input {
    padding: 0 15px 8px;
    display: block;
    font-size: $font-size-small;
    line-height: $line-height-input;
    &::placeholder {
      font-style: italic;
      color: $color-text-light;
    }
  }
</style>
