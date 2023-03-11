<script lang="ts">
  import InputLabel from './InputLabel.svelte';

  export let label: string;
  export let value: string = '';
  export let type: 'url' | 'email' | 'password' | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let spellcheck = false;
  export let required = false;

  const handleInput = (e: Event) => {
    value = (e.target as HTMLInputElement).value;
  };
</script>

<label>
  <InputLabel value={label} {required} />
  <input {type} {value} on:input={handleInput} {placeholder} {spellcheck} {required} />
</label>

<style lang="scss">
  @import 'src/lib/style/variables';

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
