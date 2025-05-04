package CS_Senin_MuhammadHilmiAlMuttaqi

public class Kelas
{
    public String namaKelas;
    public float nilai;
    public int sks;
    public Dosen dosen;

    public Kelas()
    {
        this.namaKelas = namaKelas;
        this.nilai = nilai;
        this.sks = sks;
        this.dosen = dosen;
    }

    public void showDetail()
    {
        // put your code here
        System.out.println("namaKelas: "+ namaKelas);
        System.out.println("dosen: "+ dosen);
        System.out.println("sks: "+ sks);
    }
}
