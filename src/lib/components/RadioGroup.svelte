<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let value: string;
  export let options: { value: string; title: string }[];

  const dispatch = createEventDispatcher<{ change: never }>();

  const handleChange = (event: Event) => {
    value = (event.target as HTMLInputElement).value;
    dispatch('change');
  };
</script>

<div class="root">
  <div class="title">
    <div class="title-prefix" />
    <div class="title-text">{title}</div>
    <div class="title-suffix" />
  </div>
  <div class="options">
    {#each options as option (option.value)}
      <label>
        <input
          type="radio"
          name={title}
          value={option.value}
          checked={value === option.value}
          on:change={handleChange}
        />
        <span class="radio" />
        <span class="option-title">{option.title}</span>
      </label>
    {/each}
  </div>
</div>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  .root {
    margin: -0.25em 0 0.25em;
  }

  .title {
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-bottom: calc(1px - 0.5em);
  }

  .title-text {
    font-size: $font-size-smaller;
    font-weight: 600;
    text-transform: uppercase;
    color: $color-text-light;
  }

  .title-prefix,
  .title-suffix {
    flex: 1;
    height: 1px;
    background: $color-shade-3;
    position: relative;
  }

  .title-prefix {
    margin-left: $border-radius;
  }

  .title-suffix {
    margin-right: $border-radius;
  }

  .title-prefix::before,
  .title-suffix::after {
    content: '';
    position: absolute;
    width: $border-radius;
    height: $border-radius;
    border-top: 1px solid $color-shade-3;
  }

  .title-prefix::before {
    left: -$border-radius;
    border-left: 1px solid $color-shade-3;
    border-top-left-radius: $border-radius;
  }

  .title-suffix::after {
    right: -$border-radius;
    border-right: 1px solid $color-shade-3;
    border-top-right-radius: $border-radius;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 0.75em;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    border: 1px solid $color-shade-3;
    border-top: 0;
  }

  label {
    display: flex;
    gap: 0.5em;
    cursor: pointer;
    user-select: none;
  }

  input {
    position: absolute;
    z-index: -1;
    left: 0;
    width: 0;
    height: 0;
    min-height: 0;
    min-width: 0;
    border: 0;
    background: none;
    user-select: none;
    pointer-events: none;
    box-shadow: none;
    opacity: 0;
  }

  .radio {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $color-shade-3;
    transition: background 0.25s;
    @media (pointer: fine) {
      label:hover & {
        background: darken($color-shade-3, 5%);
      }
    }
    &:after {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: $color-paper;
      opacity: 0;
      transform: scale3d(0.1, 0.1, 1);
      transition: all 0.25s;
    }
  }

  input:checked + .radio {
    background: $color-success;
    @media (pointer: fine) {
      label:hover & {
        background: darken($color-success, 5%);
      }
    }
    &:after {
      transform: scale3d(1, 1, 1);
      opacity: 1;
    }
  }

  .option-title {
    font-size: $font-size-small;
  }
</style>
