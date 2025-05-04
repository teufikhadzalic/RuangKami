public class LevelOne {
    public static void main(String args[]) {
        EntityBuilder builder = new EntityBuilder();
        Spawner spawner = new Spawner();

        Entity slime_one = spawner.spawnSlime(builder);
        Entity player = spawner.spawnPlayer(builder);
        Entity tree = spawner.spawnTree(builder);
        Entity didi = spawner.spawnDidi(builder);
        Entity dudu = spawner.spawnDudu(builder);
        Entity dada = spawner.spawnDada(builder);

        slime_one.printStats();
        player.printStats();
        tree.printStats();
        didi.printStats();
        dudu.printStats();
        dada.printStats();
    }
}
