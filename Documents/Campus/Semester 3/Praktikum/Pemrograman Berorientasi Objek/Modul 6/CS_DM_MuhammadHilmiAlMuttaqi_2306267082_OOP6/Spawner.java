public class Spawner {
    public Entity spawnSlime(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Slime").setHealth(100).setDamage(3).setLevel(1).setAttackType(AttackType.LOW_RANGE).setMoveSpeed(5).build();
    }

    public Entity spawnPlayer(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Player").setHealth(500).setDamage(50).setLevel(1).setAttackType(AttackType.HIGH_RANGE).setClassType(ClassType.WIZARD).setMoveSpeed(25).build();
    }

    public Entity spawnTree(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Tree").setHealth(100).build();
    }

    public Entity spawnDidi(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Didi").setHealth(100).build();
    }

    public Entity spawnDudu(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Dudu").setHealth(100).setDamage(5).setLevel(3).setAttackType(AttackType.LOW_RANGE).setMoveSpeed(10).build();
    }

    public Entity spawnDada(EntityBuilder builder) {
        builder.reset();
        return builder.setName("Dada").setHealth(300).setDamage(30).setLevel(2).setAttackType(AttackType.HIGH_RANGE).setClassType(ClassType.BARBARIAN).setMoveSpeed(10).build();
    }
}
