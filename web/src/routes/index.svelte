<script lang="ts">
  import {base} from '$app/paths';
  import NavButton from '$lib/components/navigation/NavButton.svelte';
  import contractsInfo from '$lib/contracts.json';
</script>

<div
  class="w-full h-full mx-auto flex text-center flex-col items-center justify-center text-gray-300 text-xl">

  <div class="mx-auto my-8">
    <img
      class="mb-8 mx-auto text-white"
      src="images/lootxp-title-fit.png"
      alt="lootxp"
      style="width:512px;"
      width="512px"
    />

    <p class="m-6 text-white font-extrabold text-4xl">
      Grab your best Loot and compete with other Looters
    </p>
  </div>

  <p class="mx-8">lootxp is a battle game for <a href="https://lootproject.com">Loot</a></p>
  <p>Each Loot token represent a set of card that you have to strategicly play to win!</p>


  <h2 class="mx-8 mt-12 mb-8 font-bold text-2xl text-gray-200">
    3 Versions for Loot, MLoot and Synthetic Loot
  </h2>

  <div class="max-w-md mx-auto pt-1 mb-5 space-y-3 md:mt-8 md:space-y-5">
    <div class="space-y-5 sm:flex sm:justify-center sm:space-y-0 sm:space-x-3">
      <NavButton blank={true} class="big secondary" href="https://loot.lootxp.xyz" label="The Original Loot">Loot</NavButton>
      <NavButton
        blank={true}
        class="big secondary"
        href="https://mloot.lootxp.xyz"
        label="MLoot"
      >
        MLoot
      </NavButton>
      <NavButton
        blank={true}
        class="big secondary"
        href="https://everyone.lootxp.xyz"
        label="Synthetic Loot"
      >
        Synthetic
      </NavButton>
    </div>
  </div>


  <h2 class="mx-8 mt-12 mb-8 font-bold text-2xl text-gray-200">
    Fully onchain
  </h2>

  <p class="mx-8">The game fully run on-chain. All resolution is resolved through lootxp Smart contract.</p>
  <p class="mx-8">Note that the game is experimental and we do not take any responsibility in potential bug lurking.</p>

  <h2 class="mx-8 mt-12 mb-8 font-bold text-2xl text-gray-200">
    XP (For adventurers)
  </h2>

  <p class="mx-8">The game is part of a larger ecosystem, that of "Xp (For Adventurers)".</p>
  <p class="mx-8">For every battle a loot is involved it get given some XP.</p>
  <p class="mx-8">The XP can then be used by other project and more game can be buidl to give these XP.</p>
  <p class="mx-8">The DMDAO (Dungeon Master DAO) will be responsible to allocate XP sink and source through the LootXPRegistry.</p>

</div>



<div
  class="border-t-2 border-gray-400 mt-16 w-full h-full mx-auto flex text-center flex-col items-center justify-center text-gray-400 ">
  <p class="m-8">
    Note that this project has not been audited and we do not take any responsability of lost loot.
  </p>

  <p class="p-1">
    The source code can be found
    <a
      href="https://github.com/wighawag/lootxp"
      target="_blank"
      class="underline">here</a>
    and the contract address is
    <a
      href={`https://etherscan.io/address/${contractsInfo.contracts.lootxp?.address}`}
      target="_blank"
      class="underline">{contractsInfo.contracts.lootxp?.address}</a>
  </p>

  <p class="p-1">
    This project was created by
    <a href="https://ronan.eth.link" target="_blank" class="underline">Ronan
      Sandford</a>
    (a.k.a
    <a
      href="https://twitter.com/wighawag"
      target="_blank"
      class="underline">wighawag
      <img
        class="w-4 h-4 inline"
        alt="wighawag"
        src={`${base}images/wig256x256.jpg`} /></a>)
  </p>

  <p class="p-1">Web Design by <a class="underline" target="_blank" href="https://vanhullebus.ch/">Buche</a> (<a class="underline" target="_blank" href="https://twitter.com/BucheMakesGames">@BucheMakesGames</a>) </p>
</div>
