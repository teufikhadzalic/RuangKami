public class Entity {
    private int health, damage, level;
    private AttackType attackType;
    private ClassType classType;
    private float moveSpeed;
    private String name;

    public Entity(String name, int health, int damage, int level, AttackType attackType, ClassType classType, float moveSpeed) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.level = level;
        this.attackType = attackType;
        this.classType = classType;
        this.moveSpeed = moveSpeed;
    }

    public String getName() { return name; }
    public int getHealth() { return health; }
    public int getDamage() { return damage; }
    public int getLevel() { return level; }
    public AttackType getAttackType() { return attackType; }
    public ClassType getClassType() { return classType; }
    public float getMoveSpeed() { return moveSpeed; }

    public String printStats() {
        String result = "Entity " + (name != null ? name : "") + " {\n";
        if (health != 0) result += "\tHealth: " + health + "\n";
        if (damage != 0) result += "\tDamage: " + damage + "\n";
        if (level != 0) result += "\tLevel: " + level + "\n";
        if (attackType != null) result += "\tAttack Type: " + attackType + "\n";
        if (classType != null) result += "\tClass Type: " + classType + "\n";
        if (moveSpeed != 0f) result += "\tMove Speed: " + moveSpeed + "\n";

        result += "}\n";

        System.out.println(result);
        return result;
    }
}
